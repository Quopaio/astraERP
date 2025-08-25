using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MixERP.Domain.Plugins
{
    public interface IMirPlugin
    {
        string Id { get; }
        string Name { get; }
        Version Version { get; }

        void ConfigureServices(IServiceCollection services, IConfiguration cfg);
    }
}
