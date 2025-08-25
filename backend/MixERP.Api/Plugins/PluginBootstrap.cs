using System.Reflection;
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MixERP.Domain.Plugins;

namespace MixERP.Api.Plugins
{
    public static class PluginBootstrap
    {
        public static IReadOnlyList<IMirPlugin> LoadPlugins(
            IServiceCollection services,
            IConfiguration cfg,
            string pluginsPath)
        {
            var list = new List<IMirPlugin>();

            if (!Directory.Exists(pluginsPath))
                Directory.CreateDirectory(pluginsPath); // fine if empty

            foreach (var dir in Directory.GetDirectories(pluginsPath))
            {
                var manifestPath = Path.Combine(dir, "plugin.manifest.json");
                if (!File.Exists(manifestPath)) continue;

                var manifest = JsonSerializer.Deserialize<PluginManifest>(
                    File.ReadAllText(manifestPath),
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (manifest is null || string.IsNullOrWhiteSpace(manifest.EntryAssembly)) continue;

                var asmPath = Path.Combine(dir, manifest.EntryAssembly);
                if (!File.Exists(asmPath)) continue;

                var asm = Assembly.LoadFile(asmPath);

                var pluginType = asm.GetTypes().FirstOrDefault(t =>
                    typeof(IMirPlugin).IsAssignableFrom(t) &&
                    !t.IsAbstract &&
                    t.GetConstructor(Type.EmptyTypes) != null);

                if (pluginType is null) continue;

                var plugin = (IMirPlugin)Activator.CreateInstance(pluginType)!;
                plugin.ConfigureServices(services, cfg);
                list.Add(plugin);
            }

            return list;
        }

        public static void MapPluginEndpoints(WebApplication app, IEnumerable<IMirPlugin> plugins)
        {
            foreach (var plugin in plugins)
            {
                // Only map endpoints if the plugin ALSO implements the API interface
                if (plugin is IApiPluginEndpoints apiPlugin)
                {
                    apiPlugin.MapEndpoints(app);
                }
            }
        }

        public sealed record PluginManifest(
            string Id,
            string Name,
            string Version,
            string EntryAssembly,
            string? MinCoreVersion = null,
            string? FeEntry = null
        );
    }
}
