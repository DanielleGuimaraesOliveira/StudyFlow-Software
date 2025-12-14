import {formataData} from "./dataFormatada"
describe("formataData",()=>{
    it("Deve formatar para o formato padrão DD/MM/AAAA",()=>{
     const data = new Date(2025, 1, 10)

     const resultado = formataData(data)
     
     expect(resultado).toBe("10/1/2025")
    })
})