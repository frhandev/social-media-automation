
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using SocialFlow.Infrastructure.Configuration;
using SocialFlow.Infrastructure.Identity;
using SocialFlow.Infrastructure.Persistence;

namespace SocialFlow.Infrastructure.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddOptions<DatabaseOptions>()
            .Bind(configuration.GetSection(
                DatabaseOptions.SectionName))
            .Validate(
                options => !string.IsNullOrWhiteSpace(
                    options.DefaultConnection),
                "DefaultConnection is required.")
            .ValidateOnStart();

        var connectionString =
            configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "DefaultConnection is missing.");

        services.AddDbContext<ApplicationDbContext>(
            options => options.UseNpgsql(connectionString));

        services
            .AddIdentity<ApplicationUser, IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.AddHealthChecks()
            .AddDbContextCheck<ApplicationDbContext>(
                name: "postgresql",
                failureStatus: HealthStatus.Unhealthy,
                tags: ["ready"]);

        return services;
    }
}