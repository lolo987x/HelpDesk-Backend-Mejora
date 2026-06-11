import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TipoCita } from '../../entities/Cita.entity';

export class CreateCitaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  hora: string; // formato HH:MM

  @IsEnum(TipoCita)
  @IsOptional()
  tipo?: TipoCita;

  @IsNumber()
  id_cliente: number;

  @IsNumber()
  @IsOptional()
  id_sucursal?: number;

  @IsNumber()
  @IsOptional()
  id_tecnico?: number;

  @IsNumber()
  @IsOptional()
  id_equipo?: number;
}