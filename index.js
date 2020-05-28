const neatCsv = require('neat-csv');
const fs = require('fs')
const TOTAL_PLAYS_FILE = 'total_plays';
const TOP_PLAYS_FILE = 'top_plays';


process.argv.forEach((value, index, array) => {
    console.log(`VALUE = ${value}, INDEX = ${index}`)
})

const composeFileName = (prefix, type) => {
    switch (type) {
        case TOTAL_PLAYS_FILE:
            return `${prefix}-plays`
        case TOP_PLAYS_FILE:
            return `${prefix}-plays`
        default:
            break;
    }
}


const processPlayFile = (file, type) => {
    let json = {
        data: [],
        labels: []
    };

    const fileName = composeFileName(file, type);
    fs.readFile(`${fileName}.csv`, async (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        let maskedResult = maskResults(await neatCsv(data), type);
        let remove = [];
        maskedResult.forEach((item, index) => {
            if (item['EpisodeTitle']) {
                if (item['EpisodeTitle'].split('VS').length > 1) {
                    json.labels.push(item['EpisodeTitle'].split(':')[0])
                    json.data.push(item.Plays);
                }
            } else {
                json.labels.push(item['Time (UTC)'].split(' ')[0])
                json.data.push(item.Plays);
            }
        })
        for (let i = 0; i < remove.length; i++) {
            maskedResult.dele
            const element = array[index];

        }
        fs.writeFileSync(`${fileName}.json`, JSON.stringify(json));
    });
}


const maskResults = (plays, type) => {

    if (type === TOTAL_PLAYS_FILE || type === TOP_PLAYS_FILE) {
        const totalPlays = plays.reduce((totalPlays, currentValue) => {
            return totalPlays += parseInt(currentValue.Plays);
        }, 0);

        return plays.map(value => {
            let newValue = { ...value };
            newValue.Plays = calc(totalPlays, parseFloat(value.Plays)).toFixed(2);
            return newValue
        });
    }

    return [];
};

const calc = (total, current) => 100 * current / total;

const files = [
    { prefix: 'weekly', type: TOTAL_PLAYS_FILE },
    { prefix: 'monthly', type: TOTAL_PLAYS_FILE },
    { prefix: 'daily', type: TOTAL_PLAYS_FILE },
    { prefix: 'top', type: TOP_PLAYS_FILE }
];


files.forEach(item => {
    processPlayFile(item.prefix, item.type);
})