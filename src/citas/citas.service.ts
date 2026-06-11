import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cita } from '../entities/Cita.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Injectable()
export class CitasService {

  constructor(
    @InjectRepository(Cita)
    private readonly citaRepo: Repository<Cita>,
  ) {}

  // Crear cita
  async create(dto: CreateCitaDto, user: any) {
    const cita = this.citaRepo.create({
      ...dto,
      id_cliente: dto.id_cliente ?? user.clienteId,
    });
    return this.citaRepo.save(cita);
  }

  // Listar citas
  async findAll(user: any, query: { mes?: number; año?: number; id_cliente?: number }) {
    const qb = this.citaRepo.createQueryBuilder('cita')
      .leftJoinAndSelect('cita.cliente', 'cliente')
      .leftJoinAndSelect('cita.sucursal', 'sucursal')
      .leftJoinAndSelect('cita.tecnico', 'tecnico')
      .leftJoinAndSelect('cita.equipo', 'equipo');

    // Scope por rol
    if (user.role === 'CLIENTE_EMPRESA' || user.role === 'CLIENTE_SUCURSAL' || user.role === 'CLIENTE_TRABAJADOR') {
      qb.andWhere('cita.id_cliente = :id_cliente', { id_cliente: user.clienteId });
    }

    // Filtro por mes y año
    if (query.mes && query.año) {
      const inicio = `${query.año}-${String(query.mes).padStart(2, '0')}-01`;
      const fin    = new Date(query.año, query.mes, 0).toISOString().split('T')[0];
      qb.andWhere('cita.fecha BETWEEN :inicio AND :fin', { inicio, fin });
    }

    // Filtro por cliente (solo administrador)
    if (query.id_cliente && user.role === 'ADMINISTRADOR') {
      qb.andWhere('cita.id_cliente = :id_cliente', { id_cliente: query.id_cliente });
    }

    return qb.orderBy('cita.fecha', 'ASC').addOrderBy('cita.hora', 'ASC').getMany();
  }

  // Ver una cita 
  async findOne(id: number, user: any) {
    const cita = await this.citaRepo.findOne({
      where: { id_cita: id },
      relations: ['cliente', 'sucursal', 'tecnico', 'equipo'],
    });
    if (!cita) throw new NotFoundException('Cita no encontrada');

    if (['CLIENTE_EMPRESA','CLIENTE_SUCURSAL','CLIENTE_TRABAJADOR'].includes(user.role)) {
      if (cita.id_cliente !== user.clienteId)
        throw new ForbiddenException('No tienes acceso a esta cita');
    }
    return cita;
  }

  // Citas de hoy
  async findHoy(user: any) {
    const hoy = new Date().toISOString().split('T')[0];
    const qb = this.citaRepo.createQueryBuilder('cita')
      .leftJoinAndSelect('cita.cliente', 'cliente')
      .leftJoinAndSelect('cita.tecnico', 'tecnico')
      .where('cita.fecha = :hoy', { hoy })
      .orderBy('cita.hora', 'ASC');

    if (['CLIENTE_EMPRESA','CLIENTE_SUCURSAL','CLIENTE_TRABAJADOR'].includes(user.role)) {
      qb.andWhere('cita.id_cliente = :id_cliente', { id_cliente: user.clienteId });
    }
    return qb.getMany();
  }

  // Actualizar cita
  async update(id: number, dto: UpdateCitaDto, user: any) {
    const cita = await this.findOne(id, user);
    Object.assign(cita, dto);
    return this.citaRepo.save(cita);
  }

  // Cancelar cita
  async cancelar(id: number, user: any) {
    const cita = await this.findOne(id, user);
    cita.estado = 'CANCELADA' as any;
    return this.citaRepo.save(cita);
  }

  // ── Eliminar cita ────────────────────────────────────────
  async remove(id: number, user: any) {
    const cita = await this.findOne(id, user);
    await this.citaRepo.remove(cita);
    return { message: `Cita #${id} eliminada correctamente` };
  }
}