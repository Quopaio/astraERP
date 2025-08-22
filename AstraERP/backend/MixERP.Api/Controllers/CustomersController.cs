using Microsoft.AspNetCore.Mvc;
using MixERP.Domain.Customers;
using MixERP.Infrastructure.Customers;

[ApiController]
[Route("customers")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerRepository _repo;
    public CustomersController(ICustomerRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery]int page=1,[FromQuery]int size=25)
        => Ok(await _repo.GetPagedAsync(page,size));

    public record CreateCustomer(string Name, string? Code, string? City);

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateCustomer dto)
        => Ok(await _repo.CreateAsync(new Customer(dto.Name, dto.Code, dto.City)));
}
