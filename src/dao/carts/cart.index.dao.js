import { CONFIG } from "../../config/config.js";
import CartFileManager from "./carts.file.js";
import CartDbManger from "./carts.mongo.js";
import __dirname from "../../utils.js";


class CartIndexDAO{
    constructor(){
        if(CONFIG.PERSISTENCE_TYPE === "file"){
            this._cartManager = new CartFileManager(`${__dirname}/data/carts.json`);
        } 
        else if(CONFIG.PERSISTENCE_TYPE === "mongo") {
            this._cartManager = new CartDbManger();
        }
    }

    getManager(){
        return this._cartManager;
    }
    
}
export default new CartIndexDAO();