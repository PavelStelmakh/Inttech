using System;
using System.Collections.Generic;
using System.Text;

namespace laba1
{
    class CSVFormat
    {
        public string Student { get; set; }
        public string Subject { get; set; }
    }

    class StudentScore
    {
        public string Subject { get; set; }
        public int Score { get; set; }
    }

    class Performance
    {
        public string Student { get; set; }
        public StudentScore[] Scores { get; set; }
    }

    class AvgScoreStudents
    {
        public string student { get; set; }
        public double avgScore { get; set; }
    }

    class AvgScoreSubject
    {
        public string subject { get; set; }
        public double avgScore { get; set; }
    }
}
