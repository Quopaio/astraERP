using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("dashboard")]
public class DashboardController : ControllerBase
{
    [HttpGet("metrics")]
    public IActionResult Metrics()
    {
        var dto = new {
            salesToday = 12345.67m,
            ordersOpen = 18,
            customersTotal = 542,
            inventoryLow = 7,
            topCustomers = new [] {
                new { name = "Acme Corp", total = 50210.12m },
                new { name = "Globex Inc", total = 40200.45m },
                new { name = "Initech", total = 35110.00m },
                new { name = "Umbrella Co", total = 24800.20m },
                new { name = "Stark Industries", total = 19880.99m }
            }
        };
        return Ok(dto);
    }
}
