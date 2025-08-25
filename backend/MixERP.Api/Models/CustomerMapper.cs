using MixERP.Domain.Customers;

namespace MixERP.Api.Models;

public static class CustomerMapper
{
    public static CustomerDto ToDto(this Customer c) =>
        new CustomerDto { Id = c.Id, Name = c.Name, Code = c.Code, City = c.City };

    public static Customer ToEntity(this CustomerDto dto) =>
        new Customer(dto.Name, dto.Code, dto.City) { Id = dto.Id == Guid.Empty ? Guid.NewGuid() : dto.Id };
}
