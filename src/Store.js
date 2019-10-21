
const Store = require('electron-store');

const store = new Store();

function createDocument(){
    return(
        <div className="document">
            <p>Test for createDoc</p>
        </div>
    );
}