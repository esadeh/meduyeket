# The hspell-nouns.txt and hspell-shemp.txt files are based on the Hspell 1.4
# distribution. Here are the commands used to generate them:

perl -w wolig.pl -d wolig.dat | iconv -f windows-1255 | grep -v '^#' | egrep ',(יחיד|רבים)$' | cut -d, -f1 | egrep '^[א-ת]{5} ' | cut -d' ' -f1 > /meduyeket/word_lists/hspell-nouns.txt
perl -w wolig.pl -d shemp.dat | iconv -f windows-1255 | grep -v '^#' | egrep ',(יחיד|רבים)$' | cut -d, -f1 | egrep '^[א-ת]{5} ' | cut -d' ' -f1 > /meduyeket/word_lists/hspell-shemp.txt
