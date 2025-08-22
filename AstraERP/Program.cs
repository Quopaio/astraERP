using Yarp.ReverseProxy;

var builder = WebApplication.CreateBuilder(args);

// Reverse proxy: /api/* -> MixERP.Api
builder.Services.AddReverseProxy().LoadFromMemory(
    routes: new[]
    {
        new RouteConfig
        {
            RouteId = "mixerp-api",
            ClusterId = "mixerp",
            Match = new() { Path = "/api/{**catchall}" },
            Transforms = new List<Dictionary<string,string>> {
                new() { ["PathRemovePrefix"]="/api" }
            }
        }
    },
    clusters: new[]
    {
        new ClusterConfig
        {
            ClusterId = "mixerp",
            Destinations = new Dictionary<string, DestinationConfig> {
                ["d1"] = new() { Address = builder.Configuration["BackendApiBase"]!.TrimEnd('/') + "/" }
            }
        }
    });

builder.Services.AddSpaStaticFiles(o => o.RootPath = "ClientApp/dist");

var app = builder.Build();

app.UseHttpsRedirection(); // ok even if you run host on HTTP; it will noop if no HTTPS
app.MapReverseProxy();     // /api -> backend

app.UseSpaStaticFiles();
app.UseSpa(spa => spa.Options.SourcePath = "ClientApp");

app.Run();
