using Microsoft.AspNetCore.Routing;

namespace MixERP.Api.Plugins
{
    // Only plugins that actually expose HTTP endpoints implement this
    public interface IApiPluginEndpoints
    {
        void MapEndpoints(IEndpointRouteBuilder app);
    }
}
