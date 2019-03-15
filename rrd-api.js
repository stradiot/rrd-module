const rrdtool = require('rrdtool');
const path = require('path');
const fs = require('fs');
const { databasePath } = require('./config');

function create(name) {
  rrdtool.create(path.join(databasePath, `${name}.rrd`),
    { start: rrdtool.now(), step: 60 },
    [
      'DS:ds:GAUGE:1440:U:U',
      'RRA:AVERAGE:0.5:1:10080',
      'RRA:AVERAGE:0.5:2:10080',
      'RRA:AVERAGE:0.5:5:8064',
      'RRA:AVERAGE:0.5:10:13104',
      'RRA:AVERAGE:0.5:15:17472',
      'RRA:AVERAGE:0.5:30:17520'
    ]
  );
};

async function remove(name) {
    return new Promise(function(resolve, reject) {
        fs.unlink(path.join(databasePath, `${name}.rrd`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function update(name, data) {
  const db = rrdtool.open(path.join(databasePath, `${name}.rrd`));
  db.update('N', { ds: data });
};

function fetch(name, start, end, resolution = 60) {
  const db = rrdtool.open(path.join(databasePath, `${name}.rrd`));
  return new Promise(function(resolve, reject) {
      db.fetch('AVERAGE', start, end, resolution, function (err, data) {
        err ? reject(err) : resolve(data);
      });
  });
};

module.exports = {
  create,
  update,
  fetch
};
