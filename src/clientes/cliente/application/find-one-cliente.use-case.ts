import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clientes } from 'src/entities/Clientes.entity';
import { ClienteResponseHelper } from '../helpers/cliente-response.helper';

@Injectable()
export class FindOneClienteUseCase {
  constructor(
    @InjectRepository(Clientes) private readonly clientesRepo: Repository<Clientes>,
    private readonly responseHelper: ClienteResponseHelper,
  ) {}

  async execute(id: number) {
    const cliente = await this.clientesRepo.findOne({
      where: { id_cliente: id },
      relations: ['sucursales', 'equipos', 'plan'],
    });
    if (!cliente) throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    return this.responseHelper.cleanResponse(cliente);
  }
}