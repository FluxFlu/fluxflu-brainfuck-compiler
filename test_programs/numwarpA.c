#include <stdio.h>
int main(){char tape[3000]={0};char*p=tape;p[4]=1;p[5]=3;p[6]=3;p[11]=3;p=tape+11;while(*p){p++;(*p)=getchar();(*p)++;p++;(*p)+=4;while(*p){p++;(*p)+=4;if(p>tape)p--;(*p)--;}p[0]=0;p+=1;while(*p){if(p-2>tape)p-=2;else p=tape;while(*p){(*p)--;while(*p){(*p)--;p++;}}p[0]=0;p+=1;while(*p){if(p>tape)p--;}p[0]=0;p+=1;(*p)--;}if(p-2>tape)p-=2;else p=tape;while(*p){p++;(*p)++;p++;(*p)++;p+=2;(*p)++;p++;(*p)++;while(*p){if(p-4>tape)p-=4;else p=tape;}if(p>tape)p--;(*p)++;p+=2;while(*p){(*p)++;if(p>tape)p--;}if(p>tape)p--;while(*p){p++;}p[0]=0;p+=1;(*p)++;while(*p){while(*p){p+=3;}p[0]=0;p+=2;(*p)++;while(*p){if(p-4>tape)p-=4;else p=tape;}p[0]=0;p+=1;(*p)--;}p[0]=1;if(p>tape)p--;(*p)++;p+=3;(*p)--;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)++;while(*p){p++;}p[0]=0;p+=2;(*p)++;if(p-3>tape)p-=3;else p=tape;(*p)++;if(p>tape)p--;(*p)++;if(p>tape)p--;(*p)-=8;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)--;if(p-2>tape)p-=2;else p=tape;(*p)++;while(*p){p++;}p[0]=0;p+=1;(*p)++;if(p-2>tape)p-=2;else p=tape;(*p)--;if(p-2>tape)p-=2;else p=tape;(*p)--;while(*p){if(p-3>tape)p-=3;else p=tape;(*p)++;if(p>tape)p--;(*p)--;while(*p){p+=2;}if(p>tape)p--;(*p)--;if(p>tape)p--;(*p)--;if(p-3>tape)p-=3;else p=tape;(*p)--;if(p>tape)p--;(*p)-=4;while(*p){if(p-3>tape)p-=3;else p=tape;(*p)--;p+=4;(*p)++;if(p>tape)p--;(*p)--;while(*p){if(p-3>tape)p-=3;else p=tape;(*p)++;while(*p){p++;}p[0]=0;p+=1;(*p)++;if(p-2>tape)p-=2;else p=tape;(*p)++;if(p>tape)p--;(*p)--;if(p>tape)p--;(*p)--;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)++;if(p>tape)p--;(*p)--;if(p>tape)p--;(*p)++;while(*p){p+=2;}if(p>tape)p--;(*p)++;if(p-4>tape)p-=4;else p=tape;(*p)++;if(p>tape)p--;(*p)--;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)--;while(*p){p++;}p[0]=0;p+=2;(*p)--;if(p-3>tape)p-=3;else p=tape;(*p)--;if(p>tape)p--;(*p)--;if(p>tape)p--;(*p)--;while(*p){if(p-3>tape)p-=3;else p=tape;(*p)++;if(p>tape)p--;(*p)--;while(*p){p+=2;}if(p>tape)p--;(*p)++;if(p-3>tape)p-=3;else p=tape;(*p)++;if(p>tape)p--;(*p)++;if(p>tape)p--;(*p)--;while(*p){if(p-4>tape)p-=4;else p=tape;(*p)++;while(*p){p++;}if(p>tape)p--;(*p)--;if(p-2>tape)p-=2;else p=tape;(*p)--;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)++;while(*p){p++;}p[0]=0;p+=2;(*p)--;if(p-4>tape)p-=4;else p=tape;(*p)--;if(p>tape)p--;(*p)--;while(*p){p+=5;(*p)++;if(p>tape)p--;(*p)--;if(p-3>tape)p-=3;else p=tape;(*p)++;if(p>tape)p--;(*p)--;while(*p){p+=2;(*p)++;if(p-2>tape)p-=2;else p=tape;(*p)--;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)--;if(p>tape)p--;(*p)--;while(*p){p++;}p[0]=0;p+=1;(*p)++;if(p-2>tape)p-=2;else p=tape;(*p)--;if(p>tape)p--;(*p)--;if(p>tape)p--;(*p)--;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)++;if(p>tape)p--;(*p)++;while(*p){p++;}if(p>tape)p--;(*p)++;if(p>tape)p--;(*p)++;if(p>tape)p--;(*p)--;while(*p){p+=2;(*p)--;if(p>tape)p--;(*p)--;if(p>tape)p--;(*p)--;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)--;while(*p){p++;}if(p>tape)p--;(*p)++;if(p>tape)p--;(*p)+=4;while(*p){if(p>tape)p--;(*p)-=8;p++;(*p)--;}p[0]=2;if(p>tape)p--;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)++;while(*p){p++;}p[0]=0;p+=2;(*p)--;if(p>tape)p--;(*p)--;if(p-4>tape)p-=4;else p=tape;(*p)--;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)--;if(p-2>tape)p-=2;else p=tape;(*p)--;p+=4;(*p)--;while(*p){if(p-4>tape)p-=4;else p=tape;(*p)++;while(*p){p++;}p[0]=0;p+=1;(*p)++;if(p-4>tape)p-=4;else p=tape;(*p)--;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)++;if(p-2>tape)p-=2;else p=tape;(*p)--;while(*p){p+=2;}if(p>tape)p--;(*p)++;if(p-5>tape)p-=5;else p=tape;(*p)--;while(*p){p+=4;(*p)--;if(p-3>tape)p-=3;else p=tape;(*p)--;if(p>tape)p--;(*p)--;}}}}}}}}}}}}}}}}}}}}}}p[0]=0;p+=1;while(*p){p++;while(*p){while(*p){while(*p){if(p-4>tape)p-=4;else p=tape;}p[0]=0;p+=1;(*p)++;p+=2;while(*p){p+=5;}if(p>tape)p--;(*p)--;}if(p>tape)p--;}p[0]=0;p+=3;(*p)++;p+=7;(*p)++;p++;}if(p>tape)p--;}if(p>tape)p--;(*p)=0;if(p-7>tape)p-=7;else p=tape;(*p)+=2;if(p>tape)p--;(*p)+=3;if(p>tape)p--;(*p)+=3;while(*p){while(*p){p++;}p[0]=0;p+=6;(*p)+=8;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)+=4;p++;(*p)+=6;p++;(*p)--;}if(p>tape)p--;(*p)--;if(p-2>tape)p-=2;else p=tape;while(*p){(*p)--;while(*p){if(p>tape)p--;(*p)++;p+=2;putchar(*p);if(p>tape)p--;(*p)--;}}if(p-4>tape)p-=4;else p=tape;while(*p){(*p)--;while(*p){(*p)--;while(*p){p++;(*p)++;if(p>tape)p--;(*p)--;}p[0]=0;p+=1;}p[0]=0;p+=5;while(*p){putchar(*p);while(*p){p++;}}if(p-2>tape)p-=2;else p=tape;while(*p){if(p>tape)p--;(*p)++;p++;(*p)--;}p[0]=0;p+=3;while(*p){if(p-2>tape)p-=2;else p=tape;(*p)+=2;while(*p){if(p>tape)p--;(*p)++;p++;(*p)-=2;}p[0]=0;p+=2;(*p)--;}if(p-2>tape)p-=2;else p=tape;while(*p){(*p)--;p++;(*p)++;if(p>tape)p--;while(*p){if(p>tape)p--;(*p)+=2;p++;(*p)--;}}if(p-3>tape)p-=3;else p=tape;while(*p){if(p>tape)p--;(*p)++;p++;(*p)--;}if(p-4>tape)p-=4;else p=tape;}p[0]=0;p+=2;(*p)++;p+=3;(*p)-=2;while(*p){if(p>tape)p--;(*p)++;p++;(*p)-=3;}if(p>tape)p--;putchar(*p);p+=2;while(*p){(*p)=0;if(p-2>tape)p-=2;else p=tape;}if(p>tape)p--;}while(*p){(*p)--;putchar(*p);(*p)=getchar();putchar(*p);putchar(*p);putchar(*p);}return 0;}