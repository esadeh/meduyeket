import csv
import random

words = set()
words.update(line.strip() for line in open('hspell-nouns.txt'))
words.update(line.strip() for line in open('hspell-shemp.txt') if not line.strip().endswith('ת'))
words.update(line.strip() for line in open('hspell-other.txt'))
words.update(line.strip() for line in open('hspell-easy-verbs.txt'))
all_words = set(words)
all_words.update(line.strip() for line in open('hspell-shemp.txt'))
all_words.update(line.strip() for line in open('hspell-verbs.txt'))

freqs = {w: int(c) for w, c in csv.reader(open('cc100.csv')) if len(w) == 5}

past_meduyakot = ['כימאי', 'מעטפת', 'נקיות', 'חיסון', 'שתיקה', 'מבואר', 'יתגלה', 'רשאים', 'הוביל']
missing_words = ['כורסא', 'ארצני' ,'משטור', 'עקידה', 'כאילו', 'האמנם']

words.update(past_meduyakot)
words.update(missing_words)
all_words.update(past_meduyakot)
all_words.update(missing_words)

meduyakot = [w for w in words if freqs.get(w, 0) >= 20000 and w not in past_meduyakot]
random.shuffle(meduyakot)
meduyakot = meduyakot[:14] + past_meduyakot + meduyakot[14:]

print('const CONCATED_WORDS = "' + ''.join(sorted(all_words)) + '";')
print('const POSSIBLE_MEDUYAKOT = "' + ''.join(meduyakot) + '";')
