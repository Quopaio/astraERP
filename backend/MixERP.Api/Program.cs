using System.Linq; // for .Select / LINQ
using Microsoft.EntityFrameworkCore;

using MixERP.Infrastructure.Data;
using MixERP.Infrastructure.Customers;

using MixERP.Api.Services;      // ICustomersStore + EfCustomersStore
using MixERP.Api.Plugins;       // plugin bootstrap
using MixERP.Domain.Plugins;

var builder = WebApplication.CreateBuilder(args);

// -------------------------------
// Database
// -------------------------------
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// -------------------------------
// Repositories / Stores
// -------------------------------
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

// Use the EF-backed customers store (choose ONE store; don't also register InMemory)
// If you ever want in-memory for dev only, swap to AddSingleton<InMemoryCustomersStore>()
//builder.Services.AddScoped<ICustomersStore, EfCustomersStore>();

builder.Services.AddSingleton<ICustomersStore, InMemoryCustomersStore>();

// -------------------------------
// Core services
// -------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// -------------------------------
// Plugins (safe if folder empty)
// -------------------------------
var pluginsDir = Path.Combine(AppContext.BaseDirectory, "plugins");
var loadedPlugins = PluginBootstrap.LoadPlugins(builder.Services, builder.Configuration, pluginsDir);

// -------------------------------
// Build & pipeline
// -------------------------------
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

// If you configured JWT auth elsewhere (e.g., builder.Services.AddAuthentication(...)),
// keep these middlewares; otherwise they are harmless.
app.UseAuthentication();
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

// Map plugin endpoints (if plugin implements IApiPluginEndpoints)
PluginBootstrap.MapPluginEndpoints(app, loadedPlugins);

app.Run();
