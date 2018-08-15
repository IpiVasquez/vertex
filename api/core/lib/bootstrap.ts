import * as path from 'path';
import * as fs from 'fs';

import { masterLogger } from 'api/lib/logger';
import { Team } from 'api/core/models';

const logger = masterLogger.getLogger('core:bootstrap', 'lib');

export async function bootstrap() {
  let json = fs.readFileSync(path.resolve(process.cwd(), 'assets/teams.json'));
  const teams = <Model.Team[]>JSON.parse(json + '');
  teams.forEach(async team => {
    try {
      const mTeam = await Team.findOne({ name: team.name });
      if (mTeam) {
        await mTeam.update(team);
        logger.info(`${team.name} updated`);
      } else {
        await Team.create(team);
        logger.info(`${team.name} created`);
      }
    } catch (e) {
      logger.error(e.message, { error: e });
    }
  });
}
