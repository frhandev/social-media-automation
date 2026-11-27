using System.Diagnostics;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using SocialFlow.API.ErrorHandling;
using SocialFlow.Application;
using SocialFlow.Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        var problem = context.ProblemDetails;

        problem.Instance ??= context.HttpContext.Request.Path.Value;

        if (!problem.Extensions.ContainsKey("traceId"))
        {
            problem.Extensions["traceId"] = Activity.Current?.Id ?? context.HttpContext.TraceIdentifier;
        }

        if (!problem.Extensions.ContainsKey("code"))
        {
            var status =
                problem.Status
                ?? context.HttpContext.Response.StatusCode;

            problem.Extensions["code"] = status switch
            {
                StatusCodes.Status400BadRequest => "BAD_REQUEST",
                StatusCodes.Status401Unauthorized => "UNAUTHORIZED",
                StatusCodes.Status403Forbidden => "FORBIDDEN",
                StatusCodes.Status404NotFound => "NOT_FOUND",
                StatusCodes.Status500InternalServerError => "INTERNAL_ERROR",
                _ => "HTTP_ERROR"
            };
        }
    };
});
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddAuthorization();
builder.Services.AddControllers();


var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/api/v1/health/live",
    new HealthCheckOptions
    {
        Predicate = _ => false
    });

if (app.Environment.IsDevelopment())
{
    app.MapHealthChecks("/api/v1/health/ready",
        new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains("ready"),
        });
}

app.MapControllers();

app.Run();

