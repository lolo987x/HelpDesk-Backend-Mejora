import { PartialType } from '@nestjs/mapped-types';
import { CreateCitaDto } from './create-cita.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoCita } from '../../entities/Cita.entity';

export class UpdateCitaDto extends PartialType(CreateCitaDto) {
  @IsEnum(EstadoCita)
  @IsOptional()
  estado?: EstadoCita;
}