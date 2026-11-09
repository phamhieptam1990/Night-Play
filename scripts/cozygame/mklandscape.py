# Dựng shared/landscape.css từ scripts/cozygame/landscape.src.css: bọc trong 2 điều kiện màn ngang (điện thoại thấp; máy tính bảng cảm ứng). Chạy: python3 scripts/cozygame/mklandscape.py
import os
d=os.path.dirname(os.path.abspath(__file__));src=open(os.path.join(d,"landscape.src.css"),encoding="utf-8").read()
head=src.split("*/",1)[0]+"*/\n";body=src.split("*/",1)[1]
pre="#home>.hl,#home>.hr{display:contents}\n"
out=head+pre+"@media (orientation:landscape) and (max-height:700px) and (min-width:560px),(orientation:landscape) and (pointer:coarse) and (max-height:900px) and (min-width:800px){\n"+body.strip()+"\n}\n"
open(os.path.join(d,"..","..","shared","landscape.css"),"w",encoding="utf-8").write(out);print("ok",len(out))
