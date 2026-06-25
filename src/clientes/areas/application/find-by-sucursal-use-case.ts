import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from 'src/entities/Area.entity';
import { Sucursales } from 'src/entities/Sucursales.entity';
import { AreaResponseHelper } from '../helpers/area-response.helper';

@Injectable()
export class FindBySucursalUseCase {
  constructor(
    @InjectRepository(Area) private readonly areaRepo: Repository<Area>,
    @InjectRepository(Sucursales) private readonly sucursalRepo: Repository<Sucursales>,
    private readonly responseHelper: AreaResponseHelper,
  ) {}

  async execute(id_sucursal: number) {
    const sucursalExists = await this.sucursalRepo.findOne({ where: { id_sucursal } });
    if (!sucursalExists) throw new NotFoundException(`Sucursal con ID ${id_sucursal} no encontrada`);

    const areas = await this.areaRepo.find({
      where: { id_sucursal: id_sucursal },
    });
    return areas.map(area => this.responseHelper.cleanResponse(area));
  }
}