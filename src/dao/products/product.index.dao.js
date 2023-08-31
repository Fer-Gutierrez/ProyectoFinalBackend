import ProductFileManager from "./products.file.js"
import ProductDbManger from "./products.mongo.js";
import { CONFIG } from "../../config/config.js";
import __dirname from "../../utils.js";


class ProductIndexDAO{
    constructor(){
        if(CONFIG.PERSISTENCE_TYPE === "file"){
            this._productManager = new ProductFileManager(`${__dirname}/data/products.json`);
        } 
        else if(CONFIG.PERSISTENCE_TYPE === "mongo") {
            this._productManager = new ProductDbManger();
        }
    }

    getManager(){
        return this._productManager;
    }
    
}
export default new ProductIndexDAO();