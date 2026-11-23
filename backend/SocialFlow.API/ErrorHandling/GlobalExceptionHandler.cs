using System.Diagnostics;
using Microsoft.AspNetCore.Diagnostics;

namespace SocialFlow.API.ErrorHandling;

public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var statusCode = exception is BadHttpRequestException badRequest
            ? badRequest.StatusCode 
            : StatusCodes.Status500InternalServerError;

        var traceId = Activity.Current?.Id ?? httpContext.TraceIdentifier;
        
        if(statusCode == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "An unhandled exception occurred. TraceId: {TraceId}", traceId);
        }
        else
        {
            logger.LogWarning(exception, "Invalid HTTP request. Status: {StatusCode}. TraceId: {TraceId}", statusCode, traceId);
        }

        var title = statusCode switch
        {
            StatusCodes.Status400BadRequest => "Bad Request",
            StatusCodes.Status413PayloadTooLarge => "Content Too Large",
            StatusCodes.Status415UnsupportedMediaType => "Unsupported Media Type",
            _ => "Internal Error"
        };

        var code = statusCode switch
        {
            StatusCodes.Status400BadRequest => "BAD_REQUEST",
            StatusCodes.Status413PayloadTooLarge => "CONTENT_TOO_LARGE",
            StatusCodes.Status415UnsupportedMediaType => "UNSUPPORTED_MEDIA_TYPE",
            _ => "INTERNAL_ERROR"
        };

        await Results.Problem(
            type: "about:blank",
            title: title,
            statusCode: statusCode,
            detail: statusCode >= 500
                ? "An unexpected error occurred."
                : "The request could not be processed.",
            instance: httpContext.Request.Path.ToString(),
            extensions: new Dictionary<string, object?>
            {
                ["code"] = code,
                ["traceId"] = traceId
            }
        ).ExecuteAsync(httpContext);

        return true;
    }
}