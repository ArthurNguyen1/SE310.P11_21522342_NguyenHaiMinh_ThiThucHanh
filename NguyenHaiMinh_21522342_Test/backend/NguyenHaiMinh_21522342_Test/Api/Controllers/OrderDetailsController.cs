using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using NguyenHaiMinh_21522342_Test.Core.DTOs;
using NguyenHaiMinh_21522342_Test.Core.Entities;
using NguyenHaiMinh_21522342_Test.Core.Interface.Repositories;

namespace NguyenHaiMinh_21522342_Test.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderDetailsController : ControllerBase
{
    private readonly IOrderDetailRepository _orderDetailRepository;
    private readonly IMapper _mapper;

    public OrderDetailsController(IOrderDetailRepository orderDetailRepository, IMapper mapper)
    {
        _orderDetailRepository = orderDetailRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _orderDetailRepository.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var orderDetail = await _orderDetailRepository.GetByIdAsync(id);
        return orderDetail != null ? Ok(orderDetail) : NotFound();
    }

    [HttpGet("order/{orderId}")]
    public async Task<IActionResult> GetByOrder(int orderId) =>
        Ok(await _orderDetailRepository.GetOrderDetailsByOrderAsync(orderId));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] OrderDetailCreateDto orderDetailDto)
    {
        var orderDetail = _mapper.Map<OrderDetail>(orderDetailDto);
        var createdOrderDetail = await _orderDetailRepository.AddAsync(orderDetail);
        return CreatedAtAction(nameof(GetById), new { id = createdOrderDetail.OrderDetailId }, createdOrderDetail);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] OrderDetailCreateDto orderDetailDto)
    {
        var orderDetail = await _orderDetailRepository.GetByIdAsync(id);
        if (orderDetail == null) return NotFound();

        _mapper.Map(orderDetailDto, orderDetail);
        await _orderDetailRepository.UpdateAsync(orderDetail);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _orderDetailRepository.DeleteAsync(id);
        return NoContent();
    }
}
