export class Utilities {

    constructor() { }

    //Get the direct opposite location of your current location
    static getAntipodeValues(current_lon, current_lat): any {
        //Formulas of calculating antipode values based on current location
        let antipode_lon = current_lon > 0 ? current_lon - 180 : current_lon + 180;
        let antipode_lat = -(current_lat);

        return { 'antipode_lon': antipode_lon, 'antipode_lat': antipode_lat };
    }
}
