export type TaskStatus = "Pendente" | "Em Andamento" | "Concluída";

interface TaskPropriedades{
    id: number;
    titulo: string;
    descricao: string;
    taskStatus?: TaskStatus;
    dataCriacao?: Date;
}

export class Task{
    private id: number;
    private titulo: string;
    private descricao: string;
    private taskStatus: TaskStatus;
    private dataCriacao: Date;

    constructor(props: TaskPropriedades){
        this.id = props.id;
        this.titulo = props.titulo;
        this.descricao = props.descricao;
        this.taskStatus = props.taskStatus ?? "Pendente";
        this.dataCriacao = props.dataCriacao ?? new Date();
    }

    public getId():number{
        return this.id;
    }

    public getTitulo():string{
        return this.titulo;
    }

    public getDescricao():string{
        return this.descricao;
    }

    public getTaskStatus():TaskStatus{
        return this.taskStatus;
    }

    public getDataCriacao():Date{
        return this.dataCriacao;
    }

    


}