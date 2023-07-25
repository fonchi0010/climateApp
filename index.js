require('dotenv').config()


const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async( ) => {

    const busquedas = new Busquedas();
    let opt;

    do{

        opt = await inquirerMenu();
        
        switch( opt ) {

            case 1:
                //Mostrar Mensaje
                const termino = await leerInput('Ciudad: ');
               
                //Buscar Lugares
                const lugares = await busquedas.ciudad( termino );
               
                //Seleccionar Lugares
                const id = await listarLugares(lugares);
                if ( id === '0') continue;
                
                const lugarSel = lugares.find( l => l.id === id);
                const { nombre, lat, lng } = lugarSel;

                //Guardar en DB
                busquedas.agregarHistorial( lugarSel.nombre );
                
                //Clima
                const clima = await busquedas.climaLugar( lugarSel.lat, lugarSel.lng );
                
                const {temp, min, max, desc } = clima

                //Mostrar Resultados
                console.clear();
                console.log('\nInformación de la Ciudad\n'.green);
                console.log('Ciudad:', nombre.red);
                console.log('Lat:', lat );
                console.log('Lng:', lng );
                console.log('Temperatura:', temp );
                console.log('Mínima:', min );
                console.log('Máxima:', max );
                console.log('Como está el Clima:', desc.red );
            break;  
            
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${(i + 1)}.`.green;
                    console.log( `${( idx )} ${( lugar )}`);
                })
            break;
        }

        if ( opt !== 0) await pausa();

    }while ( opt !== 0)
} 

main();