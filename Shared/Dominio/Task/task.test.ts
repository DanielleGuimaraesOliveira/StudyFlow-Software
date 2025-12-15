import {Task} from "./task"

describe("Task",()=>{
    it("Deve criar uma task com as propriedades corretas",()=>{
        const dataCriacao = new Date("2024-06-01");
        const task = new Task({
            id: 1,
            titulo: "Estudar TypeScript",
            descricao: "Ler a documentação oficial do TypeScript",
            taskStatus: "Pendente",
            dataCriacao: dataCriacao
        });

        expect(task.getId()).toBe(1);
        expect(task.getTitulo()).toBe("Estudar TypeScript");
        expect(task.getDescricao()).toBe("Ler a documentação oficial do TypeScript");
        expect(task.getTaskStatus()).toBe("Pendente");
        expect(task.getDataCriacao()).toBe(dataCriacao);
    })

    it("Deve criar uma task com status padrão 'Pendente' e data de criação atual",()=>{
        const dataAntiga = new Date();
        const task = new Task({
            id: 2,
            titulo: "Fazer exercícios",
            descricao: "Resolver problemas de programação"
        });
        const dataNova = new Date();
        

        expect(task.getId()).toBe(2);
        expect(task.getTitulo()).toBe("Fazer exercícios");
        expect(task.getDescricao()).toBe("Resolver problemas de programação");
        expect(task.getTaskStatus()).toBe("Pendente");
        expect(task.getDataCriacao().getTime()).toBeGreaterThanOrEqual(dataNova.getTime());
        expect(task.getDataCriacao().getTime()).toBeLessThanOrEqual(dataAntiga.getTime());
    })
})