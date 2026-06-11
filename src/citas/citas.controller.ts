import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('citas')
export class CitasController {

  constructor(private readonly citasService: CitasService) {}

  // POST /citas — crear cita
  @Post()
  @Roles('ADMINISTRADOR', 'SOPORTE_TECNICO', 'SOPORTE_INSITU', 'CLIENTE_EMPRESA', 'CLIENTE_SUCURSAL')
  create(@Body() dto: CreateCitaDto, @Req() req: any) {
    return this.citasService.create(dto, req.user);
  }

  // GET /citas — listar con filtros
  @Get()
  @Roles('ADMINISTRADOR', 'SOPORTE_TECNICO', 'SOPORTE_INSITU', 'CLIENTE_EMPRESA', 'CLIENTE_SUCURSAL', 'CLIENTE_TRABAJADOR')
  findAll(@Req() req: any, @Query() query: { mes?: number; año?: number; id_cliente?: number }) {
    return this.citasService.findAll(req.user, query);
  }

  // GET /citas/hoy — citas de hoy
  @Get('hoy')
  @Roles('ADMINISTRADOR', 'SOPORTE_TECNICO', 'SOPORTE_INSITU', 'CLIENTE_EMPRESA', 'CLIENTE_SUCURSAL', 'CLIENTE_TRABAJADOR')
  findHoy(@Req() req: any) {
    return this.citasService.findHoy(req.user);
  }

  // GET /citas/:id — detalle de una cita
  @Get(':id')
  @Roles('ADMINISTRADOR', 'SOPORTE_TECNICO', 'SOPORTE_INSITU', 'CLIENTE_EMPRESA', 'CLIENTE_SUCURSAL', 'CLIENTE_TRABAJADOR')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.citasService.findOne(id, req.user);
  }

  // PATCH /citas/:id — actualizar cita
  @Patch(':id')
  @Roles('ADMINISTRADOR', 'SOPORTE_TECNICO', 'SOPORTE_INSITU', 'CLIENTE_EMPRESA', 'CLIENTE_SUCURSAL')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCitaDto, @Req() req: any) {
    return this.citasService.update(id, dto, req.user);
  }

  // PATCH /citas/:id/cancelar — cancelar cita
  @Patch(':id/cancelar')
  @Roles('ADMINISTRADOR', 'CLIENTE_EMPRESA', 'CLIENTE_SUCURSAL')
  cancelar(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.citasService.cancelar(id, req.user);
  }

  // DELETE /citas/:id — eliminar cita
  @Delete(':id')
  @Roles('ADMINISTRADOR')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.citasService.remove(id, req.user);
  }
}