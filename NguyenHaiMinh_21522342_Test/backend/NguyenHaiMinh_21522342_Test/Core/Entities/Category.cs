using System;
using System.Collections.Generic;

namespace NguyenHaiMinh_21522342_Test.Core.Entities;

public partial class Category
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
