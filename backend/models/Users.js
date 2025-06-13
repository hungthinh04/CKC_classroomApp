const { Entity, PrimaryGeneratedColumn, Column } = require("typeorm");

@Entity()
class Users {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  maNguoiDung;

  @Column()
  email;

  @Column()
  matKhau;

  @Column()
  quyen;

  @Column()
  trangThai;
}

module.exports = { Users };
