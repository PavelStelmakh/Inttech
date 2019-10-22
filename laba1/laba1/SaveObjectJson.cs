using System;
using System.Collections.Generic;
using System.Text;

namespace laba1
{
    class SaveObjectJson
    {
        public IEnumerable<AvgScoreStudents> avgScoreStudents { get; set; }
        public IEnumerable<AvgScoreSubject> avgScoreSubject { get; set; }
    }
}
