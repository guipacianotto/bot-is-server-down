//@ts-check
export default class ErrorHandler {
    /**
     * @param {{title: string, message: string}} error
     */
    static stringfy (error) {
        return "**Erro: **" + error.title + " Motivo: " + error.message;
    }
}