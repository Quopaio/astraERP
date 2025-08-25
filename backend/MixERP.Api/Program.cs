using System.Linq; // <-- needed for .Select
using Microsoft.EntityFrameworkCore;
using MixERP.Infrastructure.Data;
using MixERP.Infrastructure.Customers;

using MixERP.Api.Plugins;   // MUST match namespace in Plugins/*.cs
using MixERP.Domain.Plugins;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Repos/services
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

// Core services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Load plugins (safe if folder empty) so they can register services
var pluginsDir = Path.Combine(AppContext.BaseDirectory, "plugins");
var loadedPlugins = PluginBootstrap.LoadPlugins(builder.Services, builder.Configuration, pluginsDir);

// Build the app
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseAuthentication(); // if applicable
app.UseAuthorization();

app.MapControllers();

// Manifest for frontend ([] when none)
app.MapGet("/api/plugins/manifest", () =>
    loadedPlugins.Select(p => new
    {
        p.Id,
        p.Name,
        Version = p.Version.ToString(),
        FeEntry = (string?)null
    })
);

// Map plugin endpoints (only if plugin implements IApiPluginEndpoints)
PluginBootstrap.MapPluginEndpoints(app, loadedPlugins);

app.Run();
