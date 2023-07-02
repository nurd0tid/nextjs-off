import supabase from '../../../supabase'
export default async function handler(req, res) {
  const { page, pageSize } = req.query;
  const start = page * pageSize;
  const end = (page + 1) * pageSize - 1;

  try {
    const { data, count } = await supabase
      .from('faqs')
      .select('*', {count: 'exact'})
      .range(start, end);

    res.status(200).json({ data, count });
  } catch (error) {
    console.error('Error fetching rows:', error);
    res.status(500).json({ error: 'Failed to fetch rows' });
  }
}





