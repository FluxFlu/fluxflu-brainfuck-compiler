#include <stdio.h>
int main(){char tape[3000]={0};char*p=tape;p[21]=1;p[30]=255;p=tape+21;while(*p){(*p)--;while(*p){p+=10;}(*p)=0;if(p-10>tape)p-=10;else p=tape;while(*p){while(*p){(*p)--;p+=10;(*p)++;if(p-10>tape)p-=10;else p=tape;}if(p-10>tape)p-=10;else p=tape;}p+=10;(*p)=getchar();(*p)-=10;}p[0]=0;p+=10;while(*p){(*p)-=37;p+=9;(*p)--;p++;}if(p>tape)p--;while(*p){(*p)++;p++;while(*p){p+=9;(*p)++;p++;}if(p>tape)p--;(*p)--;if(p-10>tape)p-=10;else p=tape;}p[0]=255;while(*p){p++;(*p)+=48;putchar(*p);(*p)-=48;if(p-11>tape)p-=11;else p=tape;}fputs(": ",stdout);p[0]=0;p+=12;(*p)+=2;if(p-4>tape)p-=4;else p=tape;(*p)++;while(*p){(*p)=0;p+=2;while(*p){p+=4;(*p)=0;p++;(*p)=0;p++;(*p)=0;p++;(*p)=0;p++;(*p)=0;p++;(*p)=0;if(p-7>tape)p-=7;else p=tape;while(*p){(*p)--;p+=3;(*p)++;p++;(*p)++;if(p-4>tape)p-=4;else p=tape;}p[0]=0;p+=8;}if(p-10>tape)p-=10;else p=tape;while(*p){p+=6;while(*p){(*p)--;if(p-4>tape)p-=4;else p=tape;(*p)++;p+=4;}if(p-16>tape)p-=16;else p=tape;}p[0]=0;p+=10;while(*p){p++;while(*p){(*p)--;p+=3;(*p)++;p+=2;(*p)++;if(p-5>tape)p-=5;else p=tape;}p[0]=0;p+=9;}if(p-10>tape)p-=10;else p=tape;while(*p){p+=6;while(*p){(*p)--;if(p-5>tape)p-=5;else p=tape;(*p)++;p+=5;}if(p-16>tape)p-=16;else p=tape;}p[0]=0;p+=10;while(*p){p+=3;(*p)=0;p+=3;(*p)=0;p++;(*p)=0;p+=3;}if(p-10>tape)p-=10;else p=tape;while(*p){if(p-10>tape)p-=10;else p=tape;}p[0]=0;p[9]=0;p+=16;(*p)++;if(p-8>tape)p-=8;else p=tape;(*p)=1;while(*p){(*p)--;p+=2;while(*p){p+=6;while(*p){(*p)--;p++;(*p)+=2;if(p>tape)p--;}p[0]=0;p+=4;}if(p-10>tape)p-=10;else p=tape;while(*p){p+=8;(*p)=0;p++;(*p)=0;if(p-4>tape)p-=4;else p=tape;while(*p){(*p)--;p+=3;(*p)+=2;if(p-3>tape)p-=3;else p=tape;}if(p-15>tape)p-=15;else p=tape;}p[0]=0;p+=10;while(*p){p+=8;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)-=9;p+=9;(*p)++;if(p-10>tape)p-=10;else p=tape;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;}}}}}}}}}}}p[0]=0;p+=2;}if(p-10>tape)p-=10;else p=tape;while(*p){p+=9;while(*p){(*p)--;if(p>tape)p--;(*p)++;if(p-3>tape)p-=3;else p=tape;(*p)++;p+=4;}if(p-19>tape)p-=19;else p=tape;}p[0]=0;p+=10;while(*p){p+=7;while(*p){(*p)--;if(p>tape)p--;(*p)++;p++;while(*p){(*p)--;if(p>tape)p--;(*p)++;p++;while(*p){(*p)--;if(p>tape)p--;(*p)++;p++;while(*p){(*p)--;if(p>tape)p--;(*p)++;p++;while(*p){(*p)--;if(p>tape)p--;(*p)++;p++;while(*p){(*p)--;if(p>tape)p--;(*p)++;p++;while(*p){(*p)--;if(p>tape)p--;(*p)++;p++;while(*p){(*p)--;if(p>tape)p--;(*p)++;p++;while(*p){(*p)--;if(p>tape)p--;(*p)++;p++;while(*p){(*p)--;if(p>tape)p--;(*p)-=9;p+=11;(*p)++;if(p-10>tape)p-=10;else p=tape;while(*p){(*p)--;if(p>tape)p--;(*p)++;p++;}}}}}}}}}}}p[0]=0;p+=3;}if(p-10>tape)p-=10;else p=tape;while(*p){p+=4;while(*p){(*p)--;p+=3;(*p)++;p+=2;(*p)++;if(p-5>tape)p-=5;else p=tape;}if(p-14>tape)p-=14;else p=tape;}p[0]=0;p+=10;while(*p){p+=7;while(*p){(*p)--;if(p-3>tape)p-=3;else p=tape;(*p)++;p+=3;}p[0]=0;p+=3;}if(p-10>tape)p-=10;else p=tape;while(*p){p+=8;while(*p){(*p)--;p++;(*p)--;if(p>tape)p--;}p[0]=0;p+=1;while(*p){if(p-9>tape)p-=9;else p=tape;while(*p){if(p>tape)p--;(*p)=0;p+=10;while(*p){(*p)--;if(p-10>tape)p-=10;else p=tape;(*p)++;p+=10;}if(p-19>tape)p-=19;else p=tape;}p[0]=0;p+=19;}if(p-19>tape)p-=19;else p=tape;}p[0]=0;p+=9;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)=0;if(p>tape)p--;(*p)++;p++;}}}}}}}}}}}if(p>tape)p--;}p[0]=0;p+=8;while(*p){if(p-6>tape)p-=6;else p=tape;while(*p){p+=8;(*p)=0;p++;(*p)=0;if(p-5>tape)p-=5;else p=tape;while(*p){(*p)--;p+=3;(*p)++;p++;(*p)++;if(p-4>tape)p-=4;else p=tape;}p[0]=0;p+=6;}if(p-10>tape)p-=10;else p=tape;while(*p){p+=8;while(*p){(*p)--;if(p-4>tape)p-=4;else p=tape;(*p)++;p+=4;}if(p-3>tape)p-=3;else p=tape;while(*p){(*p)--;p+=3;(*p)++;p++;(*p)++;if(p-4>tape)p-=4;else p=tape;}if(p-15>tape)p-=15;else p=tape;}p[0]=0;p+=10;while(*p){p+=9;while(*p){(*p)--;if(p-4>tape)p-=4;else p=tape;(*p)++;p+=4;}p[0]=0;p+=1;}if(p-10>tape)p-=10;else p=tape;while(*p){p+=8;while(*p){(*p)--;if(p>tape)p--;(*p)--;p++;}if(p-18>tape)p-=18;else p=tape;}p[0]=0;p+=10;while(*p){p+=7;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){(*p)+=10;while(*p){(*p)++;p++;(*p)--;if(p>tape)p--;}p[0]=0;p+=10;(*p)--;if(p-10>tape)p-=10;else p=tape;}}}}}}}}}}}p[0]=0;p+=3;}p[0]=0;p+=7;(*p)++;while(*p){(*p)=0;if(p-17>tape)p-=17;else p=tape;while(*p){p+=4;(*p)=0;p+=4;while(*p){(*p)--;if(p-4>tape)p-=4;else p=tape;(*p)++;p+=4;}if(p-2>tape)p-=2;else p=tape;while(*p){(*p)--;p+=2;(*p)++;if(p-2>tape)p-=2;else p=tape;}if(p-16>tape)p-=16;else p=tape;}p[0]=0;p+=10;while(*p){p+=8;while(*p){(*p)--;p++;(*p)++;if(p-3>tape)p-=3;else p=tape;(*p)++;p+=2;}p[0]=0;p+=2;}if(p-10>tape)p-=10;else p=tape;while(*p){p+=3;while(*p){(*p)--;p+=6;(*p)++;if(p-6>tape)p-=6;else p=tape;}if(p-13>tape)p-=13;else p=tape;}p[0]=0;p+=10;while(*p){p+=9;while(*p){(*p)--;if(p-6>tape)p-=6;else p=tape;(*p)++;p+=6;while(*p){(*p)--;if(p-6>tape)p-=6;else p=tape;(*p)++;p+=6;while(*p){(*p)--;if(p-6>tape)p-=6;else p=tape;(*p)++;p+=6;while(*p){(*p)--;if(p-6>tape)p-=6;else p=tape;(*p)++;p+=6;while(*p){(*p)--;if(p-6>tape)p-=6;else p=tape;(*p)++;p+=6;while(*p){(*p)--;if(p-6>tape)p-=6;else p=tape;(*p)++;p+=6;while(*p){(*p)--;if(p-6>tape)p-=6;else p=tape;(*p)++;p+=6;while(*p){(*p)--;if(p-6>tape)p-=6;else p=tape;(*p)++;p+=6;while(*p){(*p)--;if(p-6>tape)p-=6;else p=tape;(*p)++;p+=6;while(*p){(*p)--;if(p-6>tape)p-=6;else p=tape;(*p)-=9;p+=16;(*p)++;if(p-10>tape)p-=10;else p=tape;while(*p){(*p)--;if(p-6>tape)p-=6;else p=tape;(*p)++;p+=6;}}}}}}}}}}}p[0]=0;p+=1;}p[0]=0;p+=7;}if(p-17>tape)p-=17;else p=tape;while(*p){if(p-10>tape)p-=10;else p=tape;}p[0]=0;p+=10;while(*p){p+=8;(*p)=0;if(p-2>tape)p-=2;else p=tape;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;}if(p>tape)p--;while(*p){(*p)--;p+=3;(*p)++;if(p-3>tape)p-=3;else p=tape;}p[0]=0;p+=5;}if(p-10>tape)p-=10;else p=tape;while(*p){(*p)++;p+=7;while(*p){(*p)--;if(p-7>tape)p-=7;else p=tape;(*p)++;p+=7;while(*p){(*p)--;if(p-7>tape)p-=7;else p=tape;(*p)--;p+=6;(*p)++;p++;while(*p){(*p)--;if(p-7>tape)p-=7;else p=tape;(*p)++;p+=7;while(*p){(*p)--;if(p-7>tape)p-=7;else p=tape;(*p)--;p+=6;(*p)++;p++;while(*p){(*p)--;if(p-7>tape)p-=7;else p=tape;(*p)++;p+=7;while(*p){(*p)--;if(p-7>tape)p-=7;else p=tape;(*p)--;p+=6;(*p)++;p++;while(*p){(*p)--;if(p-7>tape)p-=7;else p=tape;(*p)++;p+=7;while(*p){(*p)--;if(p-7>tape)p-=7;else p=tape;(*p)--;p+=6;(*p)++;p++;while(*p){(*p)--;if(p-7>tape)p-=7;else p=tape;(*p)++;p+=7;}}}}}}}}}if(p-7>tape)p-=7;else p=tape;while(*p){(*p)--;p+=7;(*p)++;if(p-7>tape)p-=7;else p=tape;}p[0]=255;if(p-10>tape)p-=10;else p=tape;}p[0]=0;p+=7;while(*p){(*p)--;if(p-11>tape)p-=11;else p=tape;(*p)++;p+=11;}p[0]=0;p+=3;while(*p){p+=7;while(*p){(*p)--;if(p-11>tape)p-=11;else p=tape;(*p)+=5;p+=11;}p[0]=0;p+=3;}if(p-10>tape)p-=10;else p=tape;while(*p){(*p)++;p+=8;while(*p){(*p)--;if(p-8>tape)p-=8;else p=tape;(*p)++;p+=8;while(*p){(*p)--;if(p-8>tape)p-=8;else p=tape;(*p)--;p+=5;(*p)++;p+=3;while(*p){(*p)--;if(p-8>tape)p-=8;else p=tape;(*p)++;p+=8;while(*p){(*p)--;if(p-8>tape)p-=8;else p=tape;(*p)--;p+=5;(*p)++;p+=3;while(*p){(*p)--;if(p-8>tape)p-=8;else p=tape;(*p)++;p+=8;while(*p){(*p)--;if(p-8>tape)p-=8;else p=tape;(*p)--;p+=5;(*p)++;p+=3;while(*p){(*p)--;if(p-8>tape)p-=8;else p=tape;(*p)++;p+=8;while(*p){(*p)--;if(p-8>tape)p-=8;else p=tape;(*p)--;p+=5;(*p)++;p+=3;while(*p){(*p)--;if(p-8>tape)p-=8;else p=tape;(*p)++;p+=8;}}}}}}}}}if(p-8>tape)p-=8;else p=tape;while(*p){(*p)--;p+=8;(*p)++;if(p-8>tape)p-=8;else p=tape;}p[0]=255;if(p-10>tape)p-=10;else p=tape;}p[0]=0;p+=8;while(*p){(*p)--;if(p-13>tape)p-=13;else p=tape;(*p)++;p+=13;}p[0]=0;p+=2;while(*p){p+=8;while(*p){(*p)--;if(p-13>tape)p-=13;else p=tape;(*p)+=5;p+=13;}p[0]=0;p+=2;}if(p-10>tape)p-=10;else p=tape;while(*p){if(p-10>tape)p-=10;else p=tape;}p[0]=0;p+=16;}if(p-6>tape)p-=6;else p=tape;while(*p){p+=3;while(*p){(*p)--;p+=4;(*p)++;p++;(*p)++;if(p-5>tape)p-=5;else p=tape;}p[0]=0;p+=7;}if(p-10>tape)p-=10;else p=tape;while(*p){p+=7;while(*p){(*p)--;if(p-4>tape)p-=4;else p=tape;(*p)++;p+=4;}if(p-5>tape)p-=5;else p=tape;while(*p){(*p)--;p+=5;(*p)++;p+=2;(*p)++;if(p-7>tape)p-=7;else p=tape;}if(p-12>tape)p-=12;else p=tape;}p[0]=0;p+=10;while(*p){p+=7;while(*p){(*p)--;if(p-5>tape)p-=5;else p=tape;(*p)++;p+=5;}p[0]=0;p+=3;}if(p-10>tape)p-=10;else p=tape;while(*p){p+=9;while(*p){(*p)--;if(p>tape)p--;(*p)--;p++;}if(p>tape)p--;while(*p){if(p-8>tape)p-=8;else p=tape;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)=0;p+=10;while(*p){(*p)--;if(p-10>tape)p-=10;else p=tape;(*p)++;p+=10;}if(p-18>tape)p-=18;else p=tape;}p[0]=0;p+=18;}if(p-18>tape)p-=18;else p=tape;}p[0]=0;p+=8;while(*p){p++;(*p)--;if(p>tape)p--;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)++;while(*p){(*p)=0;p++;(*p)++;if(p>tape)p--;}}}}}}}}}}}p[0]=0;p+=1;(*p)++;while(*p){(*p)=0;if(p>tape)p--;(*p)=1;p+=4;(*p)++;p+=8;while(*p){p+=10;}if(p-10>tape)p-=10;else p=tape;while(*p){if(p-6>tape)p-=6;else p=tape;while(*p){if(p-4>tape)p-=4;else p=tape;while(*p){if(p-10>tape)p-=10;else p=tape;}p[0]=0;p+=4;(*p)++;if(p-10>tape)p-=10;else p=tape;}if(p-4>tape)p-=4;else p=tape;}p[0]=0;p+=20;while(*p){p+=10;}if(p-10>tape)p-=10;else p=tape;while(*p){if(p-10>tape)p-=10;else p=tape;}p[0]=0;p+=4;(*p)--;while(*p){(*p)=0;p+=8;(*p)--;if(p-2>tape)p-=2;else p=tape;while(*p){p++;(*p)=0;p+=2;while(*p){(*p)--;if(p-2>tape)p-=2;else p=tape;(*p)++;p+=2;}p[0]=0;p+=7;}if(p-10>tape)p-=10;else p=tape;while(*p){(*p)++;p+=2;while(*p){p+=8;(*p)++;p+=2;}if(p-2>tape)p-=2;else p=tape;(*p)--;if(p-10>tape)p-=10;else p=tape;}p[0]=255;while(*p){p+=2;(*p)+=48;putchar(*p);(*p)-=48;if(p-12>tape)p-=12;else p=tape;}fputs(" ",stdout);p[0]=0;p+=4;}p[0]=0;p+=6;while(*p){p+=2;while(*p){(*p)--;p+=5;(*p)++;if(p-5>tape)p-=5;else p=tape;while(*p){(*p)--;p+=5;(*p)++;if(p-5>tape)p-=5;else p=tape;while(*p){(*p)--;p+=5;(*p)++;if(p-5>tape)p-=5;else p=tape;while(*p){(*p)--;p+=5;(*p)++;if(p-5>tape)p-=5;else p=tape;while(*p){(*p)--;p+=5;(*p)++;if(p-5>tape)p-=5;else p=tape;while(*p){(*p)--;p+=5;(*p)++;if(p-5>tape)p-=5;else p=tape;while(*p){(*p)--;p+=5;(*p)++;if(p-5>tape)p-=5;else p=tape;while(*p){(*p)--;p+=5;(*p)++;if(p-5>tape)p-=5;else p=tape;while(*p){(*p)--;p+=5;(*p)++;if(p-5>tape)p-=5;else p=tape;while(*p){(*p)--;p+=5;(*p)-=9;p+=5;(*p)++;if(p-10>tape)p-=10;else p=tape;while(*p){(*p)--;p+=5;(*p)++;if(p-5>tape)p-=5;else p=tape;}}}}}}}}}}}p[0]=0;p+=8;}if(p-10>tape)p-=10;else p=tape;while(*p){p+=7;while(*p){(*p)--;if(p-5>tape)p-=5;else p=tape;(*p)++;p+=5;}if(p-17>tape)p-=17;else p=tape;}p[0]=0;p+=9;}if(p>tape)p--;}p[0]=0;p+=2;while(*p){p+=10;}if(p-10>tape)p-=10;else p=tape;while(*p){(*p)++;p++;while(*p){p+=9;(*p)++;p++;}if(p>tape)p--;(*p)--;if(p-10>tape)p-=10;else p=tape;}p[0]=255;while(*p){p++;(*p)+=48;putchar(*p);if(p-11>tape)p-=11;else p=tape;}fputs("\n",stdout);return 0;}