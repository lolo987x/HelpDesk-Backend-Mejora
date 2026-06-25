import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sucursales } from 'src/entities/Sucursales.entity';
import { Area } from 'src/entities/Area.entity';
import { AreaResponseHelper } from '../helpers/area-response.helper';
import { CreateAreaDto } from 'src/clientes/dto/create-area.dto';

@Injectable()
export class CreateAreaUseCase {
  constructor(
    @InjectRepository(Area) private readonly areaRepo: Repository<Area>,
    @InjectRepository(Sucursales) private readonly sucursalRepo: Repository<Sucursales>,
    private readonly responseHelper: AreaResponseHelper,
  ) {}

  async execute(dto: CreateAreaDto) {
    if (!dto.id_sucursal) {
      throw new BadRequestException('El ID de la sucursal es requerido');
    }
    
    const sucursal = await this.sucursalRepo.findOne({
      where: { id_sucursal: dto.id_sucursal },
    });
    if (!sucursal) throw new NotFoundException(`Sucursal con ID ${dto.id_sucursal} no encontrada`);
    
    const nuevaArea = this.areaRepo.create({
      ...dto,
      sucursal: sucursal,
    });
    
    const saved = await this.areaRepo.save(nuevaArea);
    return this.responseHelper.cleanResponse(saved);
  }
}