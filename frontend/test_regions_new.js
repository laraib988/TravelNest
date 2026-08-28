const { Client } = require('pg');
const regions = ['eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1'];
async function test() {
  for (const r of regions) {
    const client = new Client({ connectionString: `postgresql://postgres.urtuukuccwuulqwuablt:Buttar197042%23@aws-0-${r}.pooler.supabase.com:6543/postgres` });
    try {
      await client.connect();
      console.log('SUCCESS IN REGION (NEW DB):', r);
      await client.end();
      return;
    } catch (e) {
    }
  }
  console.log('None worked for new DB');
}
test();
