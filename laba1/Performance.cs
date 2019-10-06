using System;
using System.Collections.Generic;
using System.Text;

namespace laba1
{
    class Performance
    {
        public string Student { get; set; }
        public string Subject { get; set; }
        public int Score { get; set; }
    }

    interface AvgScoreStudents
    {
        string student { get; set; }
        int avgScore { get; set; }
    }

    interface AvgScoreSubject
    {
        string subject { get; set; }
        int avgScore { get; set; }
    }
}
