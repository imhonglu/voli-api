import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity()
export class Media extends BaseEntity {
  @Column()
  originalFileName!: string;

  @Column()
  fileName!: string;

  @Column()
  fileSize!: number;

  @Column()
  mimeType!: string;

  @Column()
  path!: string;

  @Column()
  userId!: number;
}
