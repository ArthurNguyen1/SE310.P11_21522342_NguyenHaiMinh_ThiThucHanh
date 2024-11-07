using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using NguyenHaiMinh_21522342_Test.Core.DTOs;
using NguyenHaiMinh_21522342_Test.Core.Entities;
using NguyenHaiMinh_21522342_Test.Core.Interface.Repositories;

namespace NguyenHaiMinh_21522342_Test.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMapper _mapper;

    public OrderController(IOrderRepository orderRepository, IMapper mapper)
    {
        _orderRepository = orderRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _orderRepository.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        return order != null ? Ok(order) : NotFound();
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetOrdersByUser(int userId) =>
        Ok(await _orderRepository.GetOrdersByUserAsync(userId));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] OrderCreateDto orderDto)
    {
        var order = _mapper.Map<Order>(orderDto);
        var createdOrder = await _orderRepository.AddAsync(order);
        return CreatedAtAction(nameof(GetById), new { id = createdOrder.OrderId }, createdOrder);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] OrderCreateDto orderDto)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null) return NotFound();

        _mapper.Map(orderDto, order);
        await _orderRepository.UpdateAsync(order);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _orderRepository.DeleteAsync(id);
        return NoContent();
    }
}
