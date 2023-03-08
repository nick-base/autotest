import { genMembers } from 'shared/fake';

export default function handler(req, res) {
  res.status(200).json({ code: 0, data: genMembers() });
}
