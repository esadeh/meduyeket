# The hspell-*.txt files are based on the Hspell 1.4 distribution. Here are the
# commands used to generate them:

perl -w wolig.pl -d wolig.dat | iconv -f windows-1255 | grep -v '^#' | egrep ',(יחיד|רבים)' | cut -d, -f1 | egrep '^[א-תךםןףץ]{5} ' | cut -d' ' -f1 > /meduyeket/word_lists/hspell-nouns.txt
for f in extrawords.hif milot.hif biza-nouns.hif; do iconv -f windows-1255 $f | egrep '^[א-תךםןףץ]{5}$' >> /meduyeket/word_lists/hspell-other.txt; iconv -f windows-1255 $f | egrep '^[א-תךםןףץ]{5} ' | cut -d' ' -f1 >> /meduyeket/word_lists/hspell-other.txt; done

perl -w woo -d woo.dat | iconv -f windows-1255 | grep -v '^#' | grep -v ',כינוי' | grep -v ',סמיכות' | egrep '^[א-תךםןףץ]{5} ' | cut -d' ' -f1 > /meduyeket/word_lists/hspell-verbs.txt
perl -w woo -d woo.dat | iconv -f windows-1255 | grep -v '^#' | grep -v ',כינוי' | grep -v ',סמיכות' | grep -v ',ציווי' | grep -v ',את' | egrep '^[א-תךםןףץ]{5} ' | cut -d' ' -f1 > /meduyeket/word_lists/hspell-easy-verbs.txt
iconv -f windows-1255 biza-verbs.hif | grep -v '^#' | grep -v ',כינוי' | grep -v ',סמיכות' | egrep '^[א-תךםןףץ]{5} ' | cut -d' ' -f1 >> /meduyeket/word_lists/hspell-verbs.txt
iconv -f windows-1255 biza-verbs.hif | grep -v '^#' | grep -v ',כינוי' | grep -v ',סמיכות' | grep -v ',ציווי' | grep -v ',את' | egrep '^[א-תךםןףץ]{5} ' | cut -d' ' -f1 >> /meduyeket/word_lists/hspell-easy-verbs.txt

perl -w wolig.pl -d shemp.dat | iconv -f windows-1255 | grep -v '^#' | egrep ',(יחיד|רבים)' | cut -d, -f1 | egrep '^[א-תךםןףץ]{5} ' | cut -d' ' -f1 > /meduyeket/word_lists/hspell-shemp.txt

# The corpus word count cc100.csv is downloaded from
#   https://github.com/eyaler/hebrew_wordlists
