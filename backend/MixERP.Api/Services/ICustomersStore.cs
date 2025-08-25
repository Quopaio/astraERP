using MixERP.Api.Models;

namespace MixERP.Api.Services
{
    public interface ICustomersStore
    {
        (IReadOnlyList<CustomerDto> items, int total) GetPaged(int page, int size, string? q = null);
        CustomerDto? GetById(Guid id);
        CustomerDto Create(CustomerDto c);
        CustomerDto? Update(Guid id, CustomerDto update);
        bool Delete(Guid id);
    }

    /// <summary>
    /// Simple in-memory store useful for development/testing.
    /// Not used in production if EfCustomersStore is registered.
    /// </summary>
    public class InMemoryCustomersStore : ICustomersStore
    {
        private readonly List<CustomerDto> _data = new();
        private readonly object _lock = new();

        public InMemoryCustomersStore()
        {
            _data.AddRange(new []
            {
                new CustomerDto { Id = Guid.NewGuid(), Name = "Acme Corp", Code = "ACM", City = "New York" },
                new CustomerDto { Id = Guid.NewGuid(), Name = "Globex Inc", Code = "GLX", City = "Boston" },
                new CustomerDto { Id = Guid.NewGuid(), Name = "Initech", Code = "INT", City = "Dallas" },
                new CustomerDto { Id = Guid.NewGuid(), Name = "Umbrella Co", Code = "UMB", City = "Chicago" },
                new CustomerDto { Id = Guid.NewGuid(), Name = "Stark Industries", Code = "STK", City = "Los Angeles" },
                new CustomerDto { Id = Guid.NewGuid(), Name = "Wayne Enterprises", Code = "WYN", City = "Gotham" }
            });
        }

        public (IReadOnlyList<CustomerDto> items, int total) GetPaged(int page, int size, string? q = null)
        {
            if (page <= 0) page = 1;
            if (size <= 0) size = 20;

            IEnumerable<CustomerDto> src = _data;
            if (!string.IsNullOrWhiteSpace(q))
            {
                var s = q.Trim().ToLowerInvariant();
                src = src.Where(c =>
                    (c.Name?.ToLowerInvariant().Contains(s) ?? false) ||
                    (c.Code?.ToLowerInvariant().Contains(s) ?? false) ||
                    (c.City?.ToLowerInvariant().Contains(s) ?? false));
            }

            var total = src.Count();
            var items = src
                .OrderBy(c => c.Name)
                .Skip((page - 1) * size)
                .Take(size)
                .ToList();

            return (items, total);
        }

        public CustomerDto? GetById(Guid id) =>
            _data.FirstOrDefault(x => x.Id == id);

        public CustomerDto Create(CustomerDto c)
        {
            if (c.Id == Guid.Empty) c.Id = Guid.NewGuid();
            lock (_lock) { _data.Add(c); }
            return c;
        }

        public CustomerDto? Update(Guid id, CustomerDto update)
        {
            lock (_lock)
            {
                var existing = _data.FirstOrDefault(x => x.Id == id);
                if (existing is null) return null;

                existing.Name = update.Name ?? existing.Name;
                existing.Code = update.Code ?? existing.Code;
                existing.City = update.City ?? existing.City;
                return existing;
            }
        }

        public bool Delete(Guid id)
        {
            lock (_lock)
            {
                var idx = _data.FindIndex(x => x.Id == id);
                if (idx < 0) return false;
                _data.RemoveAt(idx);
                return true;
            }
        }
    }
}
