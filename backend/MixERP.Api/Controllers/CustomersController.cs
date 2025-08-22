using Microsoft.AspNetCore.Mvc;
using MixERP.Api.Models;
using MixERP.Api.Services;

namespace MixERP.Api.Controllers;

[ApiController]
[Route("customers")]
public class CustomersController : ControllerBase
{
    private readonly ICustomersStore _store;
    public CustomersController(ICustomersStore store) => _store = store;

    // GET /customers?page=1&size=25&q=search
    [HttpGet]
    public IActionResult Get([FromQuery] int page = 1, [FromQuery] int size = 25, [FromQuery] string? q = null)
    {
        page = Math.Max(1, page);
        size = Math.Clamp(size, 1, 500);
        var (items, total) = _store.GetPaged(page, size, q);
        return Ok(new { items, total, page, size });
    }

    // GET /customers/{id}
    [HttpGet("{id:guid}")]
    public IActionResult GetById([FromRoute] Guid id)
    {
        var c = _store.GetById(id);
        return c is null ? NotFound() : Ok(c);
    }

    // POST /customers
    [HttpPost]
    public IActionResult Create([FromBody] CreateCustomerDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest(new { message = "Name is required" });
        var c = new CustomerDto { Name = dto.Name.Trim(), Code = dto.Code, City = dto.City };
        _store.Create(c);
        return Ok(c);
    }

    // PUT /customers/{id}
    [HttpPut("{id:guid}")]
    public IActionResult Update([FromRoute] Guid id, [FromBody] UpdateCustomerDto dto)
    {
        var updated = _store.Update(id, new CustomerDto { Name = dto.Name, Code = dto.Code, City = dto.City });
        return updated is null ? NotFound() : Ok(updated);
    }

    // DELETE /customers/{id}
    [HttpDelete("{id:guid}")]
    public IActionResult Delete([FromRoute] Guid id)
    {
        var ok = _store.Delete(id);
        return ok ? NoContent() : NotFound();
    }

    public record CreateCustomerDto(string Name, string? Code, string? City);
    public record UpdateCustomerDto(string? Name, string? Code, string? City);
}
