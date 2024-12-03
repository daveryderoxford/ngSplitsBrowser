

export interface Nation {
    abrievation: string;
    fullname: string;
}
export class Nations {

    static nullNation: Nation = {abrievation: "", fullname: "--Any--"};

    static getNations(): Array<Nation> {

        const nations = [
            { abrievation: "ARG", fullname: "Argentina", },
            { abrievation: "AUS", fullname: "Australia", },
            { abrievation: "AUT", fullname: "Austria", },
            { abrievation: "BEL", fullname: "Belgium", },
            { abrievation: "BLR", fullname: "Belorussia", },
            { abrievation: "BRA", fullname: "Brazil", },
            { abrievation: "BUL", fullname: "Bulgaria", },
            { abrievation: "CAN", fullname: "Canada", },
            { abrievation: "CHI", fullname: "Chile", },
            { abrievation: "CHN", fullname: "China", },
            { abrievation: "TPE", fullname: "Chinese Taipei", },
            { abrievation: "COL", fullname: "Colombia", },
            { abrievation: "CRO", fullname: "Croatia", },
            { abrievation: "CUB", fullname: "Cuba", },
            { abrievation: "CZE", fullname: "Czech Republic", },
            { abrievation: "DEN", fullname: "Denmark", },
            { abrievation: "ECU", fullname: "Ecuador", },
            { abrievation: "EST", fullname: "Estonia", },
            { abrievation: "FIN", fullname: "Finland", },
            { abrievation: "FRA", fullname: "France", },
            { abrievation: "GER", fullname: "Germany", },
            { abrievation: "GBR", fullname: "Great Britain", },
            { abrievation: "GRE", fullname: "Greece", },
            { abrievation: "HKG", fullname: "Hong Kong", },
            { abrievation: "HUN", fullname: "Hungary", },
            { abrievation: "IND", fullname: "India", },
            { abrievation: "INA", fullname: "Indonesia", },
            { abrievation: "IRL", fullname: "Ireland", },
            { abrievation: "ISR", fullname: "Israel", },
            { abrievation: "ITA", fullname: "Italy", },
            { abrievation: "JAM", fullname: "Jamaica", },
            { abrievation: "JPN", fullname: "Japan", },
            { abrievation: "KAZ", fullname: "Kazakhstan", },
            { abrievation: "KOR", fullname: "Korea", },
            { abrievation: "PRK", fullname: "Korea", },
            { abrievation: "LAT", fullname: "Latvia", },
            { abrievation: "LTU", fullname: "Lithuania", },
            { abrievation: "MKD", fullname: "Macedonia", },
            { abrievation: "MAS", fullname: "Malaysia", },
            { abrievation: "MDA", fullname: "Moldova", },
            { abrievation: "NED", fullname: "Netherlands", },
            { abrievation: "NZL", fullname: "New Zealand", },
            { abrievation: "NOR", fullname: "Norway", },
            { abrievation: "PAK", fullname: "Pakistan", },
            { abrievation: "POL", fullname: "Poland", },
            { abrievation: "POR", fullname: "Portugal", },
            { abrievation: "ROM", fullname: "Romania", },
            { abrievation: "RUS", fullname: "Russia", },
            { abrievation: "SVK", fullname: "Slovakia", },
            { abrievation: "SLO", fullname: "Slovenia", },
            { abrievation: "RSA", fullname: "South Africa", },
            { abrievation: "ESP", fullname: "Spain", },
            { abrievation: "SWE", fullname: "Sweden", },
            { abrievation: "SUI", fullname: "Switzerland", },
            { abrievation: "UKR", fullname: "Ukraine", },
            { abrievation: "USA", fullname: "United States", },
            { abrievation: "URU", fullname: "Uruguay", },
            { abrievation: "VEN", fullname: "Venezuela", },
            { abrievation: "YUG", fullname: "Yugoslavia", },
            { abrievation: "---", fullname: "Other" }
        ];
        return nations;
    }
}
