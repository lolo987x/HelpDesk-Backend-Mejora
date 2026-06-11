import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { Clientes } from './Clientes.entity';
import { Sucursales } from './Sucursales.entity';
import { Usuario } from './Usuario.entity';
import { Equipos } from './Equipos.entity';

export enum TipoCita {
  MANT   = 'MANT.',
  REDES  = 'REDES',
  SOPORTE = 'SOPORTE',
  OTRO   = 'OTRO',
}

export enum EstadoCita {
  PENDIENTE   = 'PENDIENTE',
  CONFIRMADA  = 'CONFIRMADA',
  CANCELADA   = 'CANCELADA',
  COMPLETADA  = 'COMPLETADA',
}

@Entity('citas')
export class Cita {

  @PrimaryGeneratedColumn()
  id_cita: number;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({ type: 'enum', enum: TipoCita, default: TipoCita.SOPORTE })
  tipo: TipoCita;

  @Column({ type: 'enum', enum: EstadoCita, default: EstadoCita.PENDIENTE })
  estado: EstadoCita;

  @Column()
  id_cliente: number;

  @ManyToOne(() => Clientes, { eager: false })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Clientes;

  @Column({ nullable: true })
  id_sucursal?: number;

  @ManyToOne(() => Sucursales, { nullable: true, eager: false })
  @JoinColumn({ name: 'id_sucursal' })
  sucursal?: Sucursales;

  @Column({ nullable: true })
  id_tecnico?: number;

  @ManyToOne(() => Usuario, { nullable: true, eager: false })
  @JoinColumn({ name: 'id_tecnico' })
  tecnico?: Usuario;

  @Column({ nullable: true })
  id_equipo?: number;

  @ManyToOne(() => Equipos, { nullable: true, eager: false })
  @JoinColumn({ name: 'id_equipo' })
  equipo?: Equipos;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}