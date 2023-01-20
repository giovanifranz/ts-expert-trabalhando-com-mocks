interface IUser {
  name: string;
  id: string;
  profession: string;
  age: string;
}

export class User {
  birthDay: number;
  name: string;
  id: number;
  profession: string;

  constructor({ age, id, name, profession }: IUser) {
    this.name = name;
    this.id = parseInt(id);
    this.profession = profession;
    this.birthDay = new Date().getFullYear() - parseInt(age);
  }
}
