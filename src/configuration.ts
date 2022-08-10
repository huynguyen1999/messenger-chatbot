const config = require('dotenv').config().parsed;
import {join} from 'path';
import {readFileSync} from 'fs';
import * as yaml from 'js-yaml';

export const configuration = () => {
    return yaml.load(
        readFileSync(join(__dirname, `../config/${config.env}.yaml`), 'utf8'),
    ) as Record<string, any>;
};

